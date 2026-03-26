/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   validation.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/26 by eric                   #+#    #+#             */
/*   Updated: 2026/03/26 by eric                  ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * Valide un objet utilisateur au format FormData
 * Suivant la trame de validation du backend
 */
export const userFormDataToValidate = (user) => {
  try {
    return [
      {
        value: user,
        expectedType: "string",
        maxLength: 1000
      },
      {
        value: JSON.parse(user),
        expectedType: "object"
      }
    ];
  } catch {
    return [
      {
        value: "string",
        expectedType: "number"
      }
    ];
  }
};

/**
 * Valide les données JSON d'un utilisateur
 * Suivant la trame de validation du backend
 */
export const userJsonDataToValidate = (user) => {
  try {
    return [
      {
        value: user.username,
        expectedType: "string",
        mask: /^[a-zA-Z0-9][a-zA-Z0-9\-']*[a-zA-Z0-9]$/,
        minLength: 3,
        maxLength: 12
      },
      {
        value: user.email,
        expectedType: "string",
        mask: /^[^\s@]{1,25}@[^\s.@]{1,18}\.[^\s.@]{1,5}$/,
        required: true
      },
      {
        value: user.password,
        expectedType: "string",
        mask: /^\S+$/,
        minLength: 3,
        maxLength: 10,
        required: true
      },
      {
        value: user.firstName,
        expectedType: "string",
        mask: /^[a-zA-Z\s'-]+$/,
        maxLength: 50,
        required: false
      },
      {
        value: user.lastName,
        expectedType: "string",
        mask: /^[a-zA-Z\s'-]+$/,
        maxLength: 50,
        required: false
      },
      {
        value: user.bio,
        required: false,
        expectedType: "string",
        maxLength: 500
      },
      {
        value: user.theme,
        required: false,
        expectedType: "string",
        mask: /^(light|dark|auto)$/
      }
    ];
  } catch {
    return [
      {
        value: "string",
        expectedType: "number"
      }
    ];
  }
};

/**
 * Valide un champ contre ses règles
 * @param {*} value - La valeur à valider
 * @param {Object} rules - Les règles de validation
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateField = (value, rules) => {
  // Vérifier si le champ est requis
  if (rules.required && (value === null || value === undefined || value === "")) {
    return {
      isValid: false,
      error: "Ce champ est requis"
    };
  }

  // Si pas requis et vide, c'est OK
  if (!rules.required && (value === null || value === undefined || value === "")) {
    return { isValid: true };
  }

  // Vérifier le type attendu
  if (rules.expectedType && typeof value !== rules.expectedType) {
    return {
      isValid: false,
      error: `Type invalide. Attendu: ${rules.expectedType}, reçu: ${typeof value}`
    };
  }

  // Vérifier la longueur minimale
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: `Minimum ${rules.minLength} caractères requis`
    };
  }

  // Vérifier la longueur maximale
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: `Maximum ${rules.maxLength} caractères autorisés`
    };
  }

  // Vérifier le format avec regex (mask)
  if (rules.mask && !rules.mask.test(value)) {
    return {
      isValid: false,
      error: "Format invalide"
    };
  }

  return { isValid: true };
};

/**
 * Valide tous les champs d'un objet utilisateur
 * @param {Object} user - L'objet utilisateur à valider
 * @returns {Object} {isValid: boolean, errors: {fieldName: errorMessage}}
 */
export const validateUser = (user) => {
  const rules = userJsonDataToValidate(user);
  const errors = {};
  let isValid = true;

  rules.forEach((rule, index) => {
    if (!rule.value || rule.expectedType === "number") {
      // Erreur dans les données
      isValid = false;
      return;
    }

    const result = validateField(rule.value, rule);
    if (!result.isValid) {
      isValid = false;
      // Déterminer le nom du champ
      const fieldNames = ["username", "email", "password", "firstName", "lastName", "bio", "theme"];
      const fieldName = fieldNames[index] || `field_${index}`;
      errors[fieldName] = result.error;
    }
  });

  return { isValid, errors };
};

/**
 * Valide un email
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const rule = {
    value: email,
    expectedType: "string",
    mask: /^[^\s@]{1,25}@[^\s.@]{1,18}\.[^\s.@]{1,5}$/
  };
  return validateField(email, rule).isValid;
};

/**
 * Valide un username
 * @param {string} username
 * @returns {boolean}
 */
export const validateUsername = (username) => {
  const rule = {
    value: username,
    expectedType: "string",
    mask: /^[a-zA-Z0-9][a-zA-Z0-9\-']*[a-zA-Z0-9]$/,
    minLength: 3,
    maxLength: 12
  };
  return validateField(username, rule).isValid;
};

/**
 * Valide un password
 * @param {string} password
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  const rule = {
    value: password,
    expectedType: "string",
    mask: /^\S+$/,
    minLength: 3,
    maxLength: 10
  };
  return validateField(password, rule).isValid;
};
