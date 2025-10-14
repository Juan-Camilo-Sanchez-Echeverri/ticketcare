export const BUSINESS_EXISTS = (field: string) => {
  const mapFields: Record<string, string> = {
    document: 'documento',
    email: 'correo electrónico',
    name: 'nombre',
    phone: 'teléfono',
  };

  const label = mapFields[field];

  return `Ya existe un registro con el ${label} proporcionado`;
};
