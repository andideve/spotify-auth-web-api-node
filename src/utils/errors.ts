type Error = { message: string };

type StatusCodes = 401 | 404 | 500;

interface Errors extends Record<StatusCodes, Error> {
  (json: Error): Error;
  missingParameter(param: string): Error;
}

const errors: Errors = ({ message }) => ({ message });
errors.missingParameter = (name) => ({ message: `Missing required parameter: ${name}` });
errors[401] = { message: 'Unauthorized' };
errors[404] = { message: 'Not Found' };
errors[500] = { message: 'Internal Server Error' };

export default errors;
