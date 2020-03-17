import { Routine, Activity, Exercise } from './types';

export const routineId = 'routine.wendler531';

// prettier-ignore
const WEEKS: Array<[string, Array<[number, number]>]> = [
  ['Week 1', [[65, 5], [75, 5], [85, 5]]],
  ['Week 2', [[70, 3], [80, 3], [90, 3]]],
  ['Week 3', [[75, 5], [85, 3], [95, 1]]],
  ['Week 4', [[40, 5], [50, 5], [60, 5]]]
];

const SUPPLEMENTAL = '';

function calc(rm1: number, percentage: number, roundingFactor: number) {
  return (
    Math.round(((rm1 * 0.9 * percentage) / 100) * roundingFactor) /
    roundingFactor
  );
}

type RoutineParameters = {
  benchPress1RM: number;
  squat1RM: number;
  deadlift1RM: number;
  standingShoulderPress1RM: number;
  roundToNearest25: boolean;
};

export const defaultParameters: RoutineParameters = {
  benchPress1RM: 80,
  squat1RM: 100,
  standingShoulderPress1RM: 45,
  deadlift1RM: 110,
  roundToNearest25: true
};

export function create(params: RoutineParameters): Routine {
  const roundingFactor = params.roundToNearest25 ? 0.4 : 2;
  return {
    id: routineId,
    name: 'Wendler 5/3/1 Triumvirate',
    description: "Triumvirate variant of Jon Wendler's 5/3/1",
    url: 'https://www.t-nation.com/workouts/531-how-to-build-pure-strength',
    activities: WEEKS.flatMap(([weekName, sets]) => {
      return [
        createActivity(`Standing Shoulder Press ${weekName}`, [
          buildExerciseWithSets(
            'Standing Shoulder Press',
            sets.map(([percentage, reps]) => ({
              reps,
              weight: calc(
                params.standingShoulderPress1RM,
                percentage,
                roundingFactor
              ),
              completed: false
            }))
          ),
          buildExerciseWithSets('Dip', repSets(5, 15, -1), SUPPLEMENTAL),
          buildExerciseWithSets('Chin-Up', repSets(5, 10, -1), SUPPLEMENTAL)
        ]),
        createActivity(`Deadlift ${weekName}`, [
          buildExerciseWithSets(
            'Deadlift',
            sets.map(([percentage, reps]) => ({
              reps,
              weight: calc(params.deadlift1RM, percentage, roundingFactor),
              completed: false
            }))
          ),
          buildExerciseWithSets(
            'Good Morning',
            repSets(5, 12, 20),
            SUPPLEMENTAL
          ),
          buildExerciseWithSets(
            'Hanging Leg Raise',
            repSets(5, 15, -1),
            SUPPLEMENTAL
          )
        ]),
        createActivity(`Bench Press ${weekName}`, [
          buildExerciseWithSets(
            'Bench Press',
            sets.map(([percentage, reps]) => ({
              reps,
              weight: calc(params.benchPress1RM, percentage, roundingFactor),
              completed: false
            }))
          ),
          buildExerciseWithSets(
            'Dumbbell Chest Press',
            repSets(5, 15, 50),
            SUPPLEMENTAL
          ),
          buildExerciseWithSets(
            'Dumbbell Row',
            repSets(5, 10, 50),
            SUPPLEMENTAL
          )
        ]),
        createActivity(`Squat ${weekName}`, [
          buildExerciseWithSets(
            'Squat',
            sets.map(([percentage, reps]) => ({
              reps,
              weight: calc(params.squat1RM, percentage, roundingFactor),
              completed: false
            }))
          ),
          buildExerciseWithSets('Leg Press', repSets(5, 15, 50), SUPPLEMENTAL),
          buildExerciseWithSets('Leg Curl', repSets(5, 10, 50), SUPPLEMENTAL)
        ])
      ];
    }),
    routineParameters: {
      type: 'object',
      properties: {
        benchPress1RM: {
          type: 'number',
          title: 'Bench Press 1RM',
          default: 0
        },
        squat1RM: {
          type: 'number',
          title: 'Squat 1RM',
          default: 0
        },
        deadlift1RM: {
          type: 'number',
          title: 'Deadlift 1RM',
          default: 0
        },
        standingShoulderPress1RM: {
          type: 'number',
          title: 'Standing Shoulder Press 1RM',
          default: 0
        },
        roundToNearest25: {
          type: 'boolean',
          title: 'Round to 2.5 kg',
          default: true
        }
      },
      required: [
        'benchPress1RM',
        'squat1RM',
        'deadlift1RM',
        'standingShoulderPress1RM',
        'roundToNearest25'
      ]
    }
  };
}

function createActivity(title: string, exercises: Exercise[]): Activity {
  return {
    title,
    exercises
  };
}

function repSets(sets: number, reps: number, weight: number) {
  return Array.from({ length: sets }).map(() => ({
    reps,
    weight,
    completed: false
  }));
}

function buildExerciseWithSets(name: string, sets: any[], text = '') {
  return { name, sets, text };
}
