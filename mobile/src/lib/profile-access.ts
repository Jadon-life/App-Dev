/** A stored student UUID is not consent to read another account. */
export function progressLearnerId(
  userId: string | undefined,
  role: string | undefined,
): string | undefined {
  return role === "student" ? userId : undefined;
}
export function editableProfile(name: string, role: "student" | "parent") {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 100)
    throw new Error("Enter a name between 1 and 100 characters.");
  // IDs, email and student links are never client-editable profile fields.
  return { name: trimmed, role };
}
