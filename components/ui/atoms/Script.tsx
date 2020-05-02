export const Script: React.FC = ({ children }) => (
  <script dangerouslySetInnerHTML={{ __html: children.toString() }}></script>
);
