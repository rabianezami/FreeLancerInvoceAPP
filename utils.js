// 
export function validateField(input) {
  if (input.value.trim() === "") {
    input.classList.add("is-invalid");
    input.nextElementSibling.classList.remove("d-none");
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.nextElementSibling.classList.add("d-none");
    return true;
  }
}

export function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
