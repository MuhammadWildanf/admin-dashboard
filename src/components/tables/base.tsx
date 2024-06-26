import CSS from "csstype";

type Props = {
  children?: JSX.Element | JSX.Element[] | string;
  className?: string;
  style?: CSS.Properties;
  cols?: number;
  rows?: number;
  bordered?: boolean;
  onClick?: () => void;
};

const Table = ({ children, className, style }: Props) => {
  return (
    <table style={style} className={`table-full w-full ${className}`}>
      {children}
    </table>
  );
};

const Thead = ({ children, className, style }: Props) => {
  return (
    <thead style={style} className={`bg-blue-50 ${className}`}>
      {children}
    </thead>
  );
};

const Th = ({ children, className, style, cols, rows }: Props) => {
  return (
    <th
      colSpan={cols}
      rowSpan={rows}
      style={style}
      className={`border-none text-left p-2 text-sm ${className}`}
    >
      {children}
    </th>
  );
};

const TBody = ({ children, className, style }: Props) => {
  return (
    <tbody style={style} className={className}>
      {children}
    </tbody>
  );
};

const Tr = ({ children, className, style, onClick }: Props) => {
  return (
    <tr
      style={style}
      onClick={onClick}
      className={`border-t text-sm ${className}`}
    >
      {children}
    </tr>
  );
};

const Td = ({ children, className, style, cols }: Props) => {
  return (
    <td
      style={style}
      className={`border-none font-normal p-3 ${className}`}
      colSpan={cols}
    >
      {children}
    </td>
  );
};

const Td2 = ({ children, className, style, cols, rows }: Props) => {
  return (
    <td
      style={style}
      className={` border-none font-normal ${className}`}
      colSpan={cols}
      rowSpan={rows}
    >
      {children}
    </td>
  );
};

const Loading = () => {
  return (
    <div role="status" className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const TrLoading = ({ cols, rows }: Props) => {
  return (
    <>
      {Array(rows)
        .fill(null)
        .map((_, index) => (
          <Table.Tr>
            {Array(cols)
              .fill(null)
              .map((_, index) => (
                <Table.Td>
                  <Loading />
                </Table.Td>
              ))}
          </Table.Tr>
        ))}
    </>
  );
};

const NotFound = () => {
  return <div className="py-2 text-sm text-center">Data not found!</div>;
};

Table.Thead = Thead;
Table.Th = Th;
Table.Tbody = TBody;
Table.Tr = Tr;
Table.Td = Td;
Table.Td2 = Td2;
Table.Loading = Loading;
Table.NotFound = NotFound;
Table.TrLoading = TrLoading;

export default Table;
