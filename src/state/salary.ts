import { type StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";

// *********************TYPES***************//

export interface Salary {
  id: number;
  date: Date;
  amount: number;
}

export interface SalariesState {
  salaries: Salary[];
}

interface Actions {
  setSalaries: (salaries: Salary[]) => void;
  addSalary: (salary: Salary) => void;
}

// *********************STATE***************//

const UserStateApi: StateCreator<SalariesState & Actions> = (set, get) => ({
  salaries: [],
  setSalaries: (salaries) => {
    set({ salaries });
  },
  addSalary: (salary) => {
    set({ salaries: [...get().salaries, salary] });
  },
});

export const useSalaryState = create<SalariesState & Actions>()(
  devtools(UserStateApi),
);
