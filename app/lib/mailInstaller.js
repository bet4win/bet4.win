// Builds the Terminal command that installs a signature into Apple Mail.
//
// Why a command and not a paste: Mail's own signature editor rewrites a pasted
// signature when Settings closes — embedded images become attachment objects
// at their native size and are moved out of the table, which is how recipients
// got the icons and the banner stacked below the card. What survives is the
// HTML written straight into the signature's .mailsignature file with remote
// image URLs, and the file locked (Finder's "Locked") so Mail cannot rewrite
// it. Verified end to end on 2026-09-23: Apple Mail → Gmail, layout intact.
//
// The command finds the signature by its name in Mail, so nobody has to go
// looking for the file's UUID. It uses only what every Mac ships with —
// osascript, plutil, chflags — and runs the same in zsh and bash.

export const MAIL_SIGNATURE_NAME = "Bet4.win";

// The markup Mail itself writes around a signature, plus the colour-scheme
// declaration that stops Mail's dark mode inverting the navy card to lavender.
function document(html) {
  return (
    '<head><meta charset="UTF-8"><meta name="color-scheme" content="light dark">' +
    '<meta name="supported-color-schemes" content="light dark">' +
    "<style>:root{color-scheme:light dark;supported-color-schemes:light dark;}</style></head>" +
    '<body style="color-scheme: light dark; overflow-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;">' +
    html +
    "</body>"
  );
}

// Quoted-printable, the transfer encoding Mail uses for these files. The
// apostrophe is encoded too (=27) although it is printable: the result travels
// inside a single-quoted shell string, where a bare ' would end it.
function quotedPrintable(text) {
  const bytes = new TextEncoder().encode(text);
  const lines = [];
  let line = "";
  for (const b of bytes) {
    const literal = b >= 33 && b <= 126 && b !== 61 && b !== 39;
    const token = literal || b === 32 ? String.fromCharCode(b) : `=${b.toString(16).toUpperCase().padStart(2, "0")}`;
    // 76 is the limit; a soft break costs one more character.
    if (line.length + token.length > 75) {
      lines.push(`${line}=`);
      line = "";
    }
    line += token;
  }
  // A space at the end of an encoded line would be stripped in transit.
  if (line.endsWith(" ")) line = `${line.slice(0, -1)}=20`;
  lines.push(line);
  return lines.join("\n");
}

export function mailInstallerCommand(html) {
  const body = quotedPrintable(document(html));
  return `(
NAME='${MAIL_SIGNATURE_NAME}'
BODY='${body}'
osascript -e 'tell application "Mail" to quit' 2>/dev/null
while pgrep -xq Mail; do sleep 1; done
F=$(find "$HOME/Library/Mobile Documents/com~apple~mail/Data" "$HOME/Library/Mail" -maxdepth 4 -name AllSignatures.plist 2>/dev/null | while IFS= read -r P; do
  i=0
  while N=$(plutil -extract "$i.SignatureName" raw -o - "$P" 2>/dev/null); do
    if [ "$N" = "$NAME" ]; then echo "$(dirname "$P")/$(plutil -extract "$i.SignatureUniqueId" raw -o - "$P").mailsignature"; break; fi
    i=$((i+1))
  done
done | head -n 1)
if [ -z "$F" ]; then
  echo "No Mail signature named $NAME. Create one in Mail > Settings > Signatures, then run this again."
  exit 1
fi
[ -e "$F" ] && chflags nouchg "$F"
if printf 'Content-Transfer-Encoding: quoted-printable\\nContent-Type: text/html;\\n\\tcharset=utf-8\\nMessage-Id: <%s>\\nMime-Version: 1.0\\n\\n%s\\n' "$(uuidgen)" "$BODY" > "$F" && chflags uchg "$F"; then
  open -a Mail
  echo "Signature installed. It is locked, so Mail will not rewrite it; run a new installer to change it."
else
  echo "Could not write $F. Give Terminal Full Disk Access (System Settings > Privacy & Security), then run this again."
  exit 1
fi
)`;
}
