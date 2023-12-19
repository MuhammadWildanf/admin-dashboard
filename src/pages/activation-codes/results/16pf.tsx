type Props = {
  data: any;
};

const Test16PFResult = ({ data }: Props) => {
  console.log(data);
  return (
    <>
      <div className="w-full py-4">
        <strong className="py-4 block">{data.name}</strong>
        <div className="grid grid-cols-10 gap-3">
          {data?.result?.map((item: any, key: number) => (
            <div className="w-full flex gap-3">
              <div className="w-7">{key + 1}</div>
              <div className="uppercase">: {item.value ?? "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Test16PFResult;
