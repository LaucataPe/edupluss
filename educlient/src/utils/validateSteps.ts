import { CreateStep } from "./interfaces";

 export interface StepErrors {
    title?: string;
    description?: string;
    video?: string;
    send?: string
  }

  
  export const validate = (step: CreateStep) => {
    const errors: StepErrors = {};
  
    if (!step.title.trim()) {
      errors.title = 'El título es obligatorio.';
    } else if (step.title.trim().length > 100) {
      errors.title = 'El título no puede tener más de 100 caracteres.';
    }
  
    if (!step.description.trim()) {
      errors.description = 'La descripción es obligatoria.';
    } else if (step.description.trim().length > 500) {
      errors.description = 'La descripción no puede tener más de 500 caracteres.';
    }
     
    return errors;
  };
  