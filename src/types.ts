export type Routine = {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  activities: Activity[];
  routineParameters: { [key: string]: any };
};

export type Activity = {
  title: string;
  exercises: any[];
};

export type Exercise = {
  name: string;
  sets: any[];
  text: string;
};
