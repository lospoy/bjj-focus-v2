export const jitsTitle = "My Jits";

export const appTitles = {
  jits: "My Jits",
  newJit: "New Jit",
  editJit: "Edit Jit",
  sequences: "My Sequences",
  newSequence: "New Sequence",
  editSequence: "Edit Sequence",
  positions: "My Positions",
  newPosition: "New Position",
  editPosition: "Edit Position",
  moves: "My Moves",
  newMove: "New Move",
  editMove: "Edit Move",
  sessions: "My Sessions",
  newSession: "New Session",
  editSession: "Edit Session",
  dashboard: "Dashboard",
  settings: "Settings",
};

export const PageTitle = (props: { title: string }) => {
  return (
    <div className="flex h-32 items-center justify-center">
      <h1 className="mb-4 mt-2 whitespace-nowrap text-[5rem] font-bold uppercase tracking-tighter text-secondary">
        {props.title}
      </h1>
    </div>
  );
};
