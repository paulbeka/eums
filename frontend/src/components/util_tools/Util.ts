export const formatArticleContent = (content: string) => {
  return content
    .replace(/\\u([a-fA-F0-9]{4})/g, (match, group) => 
      String.fromCharCode(parseInt(group, 16)) 
    )
    .replace(/(?:\\r\\n|\\r|\\n)/g, '<br>')
    .replace(/\\"/g, '"');
}
