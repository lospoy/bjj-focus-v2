export const PageTitle = (props: { title: string }) => {
  return (
    <div className="flex h-32 items-center justify-center">
      <h1 className="mb-4 mt-2 whitespace-nowrap text-[5rem] font-bold tracking-tighter text-secondary">
        {props.title}
      </h1>
    </div>
  );
};
