import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const Biodata = ({ data }: Props) => {
  return (
    <>
      <strong>Biodata Peserta</strong>
      <div className="mt-2">
        <div className="grid grid-cols-3 py-1">
          <div className="">Agama</div>
          <div className="col-span-2 capitalize">
            : {data?.data.agama || "-"}
          </div>
        </div>

        <div className="grid grid-cols-3  py-1">
          <div className="">Status Pernikahan</div>
          <div className="col-span-2 capitalize">
            : {data?.data.status_perkawinan || "-"}
          </div>
        </div>

        <div className="grid grid-cols-3  py-1">
          <div className="">Alamat Lengkap</div>
          <div className="col-span-2">: {data?.data.alamat || "-"}</div>
        </div>

        <div className="grid grid-cols-3  py-1">
          <div className="">No Telp</div>
          <div className="col-span-2 ">: {data?.data.no_telphone || "-"}</div>
        </div>

        <div className="grid grid-cols-3  py-1">
          <div className="">Email</div>
          <div className="col-span-2 ">: {data?.data.email || "-"}</div>
        </div>

        <div className="grid grid-cols-3  py-1">
          <div className="">Bahasa Asing</div>
          <div className="col-span-2 capitalize">
            : {data?.data.bahasa_asing || "-"}
          </div>
        </div>

        <div className="grid grid-cols-3  py-1">
          <div className="">Posisi yang dituju</div>
          <div className="col-span-2 capitalize">
            : {data?.data.posisi_yang_dituju || "-"}
          </div>
        </div>

        <div className="py-2 mt-2">
          <strong className="mb-2 block">Catatan Keluarga</strong>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No</Table.Th>
                <Table.Th>Hubungan Dalam Keluarga</Table.Th>
                <Table.Th>Pendidikan</Table.Th>
                <Table.Th>Pekerjaan</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.data.keluarga?.map((dt: any, key: number) => (
                <Table.Tr key={key}>
                  <Table.Td>{(key + 1).toString()}</Table.Td>
                  <Table.Td>{dt?.hubungan_dalam_keluarga || "-"}</Table.Td>
                  <Table.Td>{dt?.pendidikan || "-"}</Table.Td>
                  <Table.Td>{dt?.pekerjaan || "-"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        <div className="py-2 mt-2">
          <strong className="mb-2 block">Riwayat Pendidikan</strong>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No</Table.Th>
                <Table.Th>Tingkat Pendidikan</Table.Th>
                <Table.Th>Nama Lembaga Pendidikan</Table.Th>
                <Table.Th>Jurusan/Prodi</Table.Th>
                <Table.Th>Dari-Sampai (bln/thn)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.data.pendidikan?.map((dt: any, key: number) => (
                <Table.Tr key={key}>
                  <Table.Td>{(key + 1).toString()}</Table.Td>
                  <Table.Td>{dt?.jurusan || "-"}</Table.Td>
                  <Table.Td>{dt?.dari_sampai || "-"}</Table.Td>
                  <Table.Td>{dt?.tingkat_pendidikan || "-"}</Table.Td>
                  <Table.Td>{dt?.nama_lembaga_pendidikan || "-"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      <div className="py-2 mt-2">
        <strong className="mb-2 block">Pengalaman Kerja</strong>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Nama Perusahaan</Table.Th>
              <Table.Th>Jabatan</Table.Th>
              <Table.Th>Dari-Sampai (bln/thn)</Table.Th>
              <Table.Th>Gaji</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.data.pengalaman_kerja?.map((dt: any, key: number) => (
              <Table.Tr key={key}>
                <Table.Td>{(key + 1).toString()}</Table.Td>
                <Table.Td>{dt?.nama_perusahaan || "-"}</Table.Td>
                <Table.Td>{dt?.jabatan || "-"}</Table.Td>
                <Table.Td>{dt?.dari_sampai || "-"}</Table.Td>
                <Table.Td>{dt?.gaji || "-"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <div className="py-2 mt-2">
        <strong className="mb-2 block">Pengalaman Organisasi</strong>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Nama Organisasi</Table.Th>
              <Table.Th>Jabatan</Table.Th>
              <Table.Th>Dari-Sampai (bln/thn)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.data.pengalaman_organisasi?.map((dt: any, key: number) => (
              <Table.Tr key={key}>
                <Table.Td>{(key + 1).toString()}</Table.Td>
                <Table.Td>{dt?.jabatan || "-"}</Table.Td>
                <Table.Td>{dt?.dari_sampai || "-"}</Table.Td>
                <Table.Td>{dt?.nama_organisasi || "-"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <div className="py-2 mt-2">
        <strong className="mb-2 block">Lain-lain</strong>
        <p className="m-0">
          1. Sebutkan minimal empat (4) kelebihan dan kekurangan yang Anda
          miliki:
        </p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div className="mt-2">
            <strong>Kelebihan</strong>
            <ul className="pl-4">
              {data?.data?.kelebihan?.map((kelebihan: any, key: number) => (
                <li key={key} className="py-1">
                  {key + 1}. {kelebihan}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2">
            <strong>Kekurangan</strong>
            <ul className="pl-4">
              {data?.data?.kekurangan?.map((kekurangan: any, key: number) => (
                <li key={key} className="py-1">
                  {key + 1}. {kekurangan}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4">
          2. Sebutkan hobi/ minat baik yang Anda tekuni maupun yang tidak Anda
          tekuni:
        </p>
        <span className="pl-4">{data?.data?.hobi || ""}</span>

        <p className="mt-4">
          3. Sebutkan hobi/ minat baik yang Anda tekuni maupun yang tidak Anda
          tekuni:
        </p>
        <span className="pl-4">{data?.data?.cita_cita || ""}</span>

        <p className="mt-4">
          4. Anda pernah atau sedang menderita sakit tertentu:
        </p>
        <div className="pl-3 mt-1">
          {data?.data.pernah_sakit ? "Ya" : "Tidak"}
          <div className="mt-2">Bila Ya, sebutkan:</div>
          <p className="m-0">{data?.data?.keterangan_sakit ?? ""}</p>
        </div>
      </div>
    </>
  );
};

export default Biodata;
