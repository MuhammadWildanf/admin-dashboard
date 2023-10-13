type Props = {
  data: any;
};

const GrafisResult = ({ data }: Props) => {
  return (
    <div className="w-full py-4">
      <strong>{data.name}</strong>
      <div className="mt-2">
        {data.result.map((item: string, key: number) => (
          <>
            <img key={key} src={item} className="w-full" alt={`img ${key}`} />
          </>
        ))}
      </div>
    </div>
  );
};

export default GrafisResult;
