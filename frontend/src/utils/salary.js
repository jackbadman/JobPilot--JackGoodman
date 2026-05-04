export const sanitizeSalaryInput = value => String(value).replace(/[^\d,]/g, "");

export const parseSalary = value => {
  const normalized = String(value).trim().replaceAll(",", "");
  if (!normalized) return undefined;

  const salary = Number(normalized);
  if (!Number.isFinite(salary) || salary < 0) {
    throw new Error("Salary must be a valid positive number.");
  }

  return salary;
};
