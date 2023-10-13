type Props = {
  data: any;
};

const DocsResult = ({ data }: Props) => {
  return (
    <div className="w-full py-4">
      <strong>{data.name}</strong>
      <div className="mt-1 test-result-docs">
        {data.result && (
          <div dangerouslySetInnerHTML={{ __html: data.result?.value }} />
        )}
      </div>
    </div>
  );
};

export default DocsResult;
