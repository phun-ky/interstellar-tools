// Keeps GitHub alerts (> [!NOTE] and friends) in the API pages TypeDoc writes.
// remark escapes the marker as \[!NOTE], which VitePress then shows as text.
// Turning the marker into a raw html node makes remark write it unescaped.
const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/;
const visit = (node) => {
  if (node.type === 'blockquote') {
    const paragraph = node.children[0];
    const text = paragraph?.type === 'paragraph' && paragraph.children[0];
    const marker = text?.type === 'text' && text.value.match(ALERT);

    if (marker) {
      const rest = text.value.slice(marker[0].length);

      paragraph.children.splice(
        0,
        1,
        { type: 'html', value: marker[0] },
        ...(rest ? [{ type: 'text', value: rest }] : [])
      );
    }
  }

  for (const child of node.children ?? []) visit(child);
};

export default function remarkGithubAlerts() {
  return visit;
}
