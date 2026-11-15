// Merges the "Throws" sections TypeDoc writes, one per @throws tag, into one
// section with a list, so a function that throws three ways has one heading,
// and one entry in the page outline, instead of three.
const isThrows = (node) =>
  node?.type === 'heading' &&
  node.children.length === 1 &&
  node.children[0].type === 'text' &&
  node.children[0].value === 'Throws';
// The blocks of the section under the heading at `start`: up to the next
// heading of the same depth or higher
const sectionEnd = (children, start) => {
  const { depth } = children[start];

  let end = start + 1;

  while (
    end < children.length &&
    !(children[end].type === 'heading' && children[end].depth <= depth)
  )
    end++;

  return end;
};
const merge = (parent) => {
  const { children } = parent;

  for (let start = 0; start < children.length; start++) {
    if (!isThrows(children[start])) continue;

    const { depth } = children[start];
    const items = [];

    let end = start;

    while (isThrows(children[end]) && children[end].depth === depth) {
      const next = sectionEnd(children, end);

      items.push(children.slice(end + 1, next));
      end = next;
    }

    if (items.length < 2) continue;

    children.splice(start + 1, end - start - 1, {
      type: 'list',
      ordered: false,
      spread: false,
      children: items.map((blocks) => ({
        type: 'listItem',
        spread: false,
        children: blocks
      }))
    });
  }
};

export default function remarkMergeThrows() {
  return merge;
}
