import { eyecontent, nosecontent, facecontent } from '@/assets/cdnImages';

const bgImages = {
  eye: eyecontent,
  nose: nosecontent,
  face: facecontent,
};

const ProcedureDetail = ({ part, children }) => {
  const backgroundImage = bgImages[part] || "";

  return (
    <div
      className="min-h-[1500px] w-full bg-cover bg-center bg-no-repeat text-right flex-col px-12 text-white py-10 text-shadow"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {children}
    </div>
  );
};

export default ProcedureDetail;