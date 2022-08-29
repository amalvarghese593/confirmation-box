export default function Modal({ children, open, close = () => {} }) {
  if (!open) return "";
  return (
    <div>
      <div className="absolute bg-black opacity-90 inset-0 z-40" />

      <div className="absolute z-50 bg-white md:rounded-2xl inset-0 md:inset-[33%] text-gray-800">
        <div className="bg-gray-50 rounded-2xl p-8 flex items-center gap-3 text-2xl">
          <div className="">Confirmation</div>
          <div className="bg-red-500 rounded-full h-[40px] w-[40px] font-black text-white flex items-center justify-center transition rotate-12">
            !
          </div>
          <div className="flex-grow flex justify-end">
            <div onClick={close}>X</div>
          </div>
        </div>
        <div className="p-8 flex w-full items-center justify-center text-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
