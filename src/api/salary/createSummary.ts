/* eslint-disable @typescript-eslint/no-unused-vars */
// Libs
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Componets
import type { ProductSale, Salary } from "@state";

const supabase = createClientComponentClient();

interface NewSalary {
  date: Date;
  amount: number;
}

export const createSalary = async (newSalary: NewSalary): Promise<Salary[]> => {
  try {
    // Voy a insertar el plan
    const { data, error } = await supabase
      .from("salary")
      .insert(newSalary)
      .select();

    // Si hay un error lanzar error
    if (data.length === 0 || data === null) {
      throw new Error();
    } else if (error !== null) {
      throw new Error();
    }

    return data as Salary[];
  } catch {
    return [];
  }
};
