const formStyles = {
  "./images/Heptarun-169.jpg": {
    formBoxStyle: { width: 18.8, height: 34 },
    inputBoxStyle: { height: 76 },
    inputFieldStyle: { width: 150, height: 30 },
    loginBtnStyle: { width: 90, height: 55, marginLeft: 15 },
  },
  "./images/Heptarun-43.jpg": {
    formBoxStyle: { width: 14.8, height: 33.9 },
    inputBoxStyle: { height: 75 },
    inputFieldStyle: { width: 108, height: 30 },
    loginBtnStyle: { width: 68, height: 53, marginLeft: 10 },
  },
};

const doFirst = () => {
  const loginPage = document.querySelector("#login-page");
  const imageElement = document.querySelector("#bg-img");
  const formBox = document.querySelector("#form-box");
  const inputBox = document.querySelector("#input-box");
  const inputFields = document.querySelectorAll(".input-field");
  const accountInput = document.querySelector("#account");
  const passwordInput = document.querySelector("#password");
  const loginBtn = document.querySelector("#login-btn");
  const errorMessage = document.querySelector("#error-message");

  const setFormStyle = (imageSrc, imageRatio) => {
    const formStyle = formStyles[imageSrc];
    if (formStyle) {
      const { formBoxStyle, inputBoxStyle, inputFieldStyle, loginBtnStyle } =
        formStyle;

      formBox.style.transform = `scale(${imageRatio})`;
      formBox.style.width = `${formBoxStyle.width}rem`;
      formBox.style.height = `${formBoxStyle.height}rem`;
      inputBox.style.height = `${inputBoxStyle.height}px`;

      inputFields.forEach((inputField) => {
        inputField.style.width = `${inputFieldStyle.width}px`;
        inputField.style.height = `${inputFieldStyle.height}px`;
      });

      loginBtn.style.width = `${loginBtnStyle.width}px`;
      loginBtn.style.height = `${loginBtnStyle.height}px`;
      loginBtn.style.marginLeft = `${loginBtnStyle.marginLeft}px`;
    }
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenRatio = screenWidth / screenHeight;

    if (screenRatio > 3) {
      loginPage.style.overflow = `auto`;
    } else {
      loginPage.style.overflow = `hidden`;
    }

    const imageSrc =
      screenRatio > 1.9 || screenRatio < 1
        ? "./images/Heptarun-169.jpg"
        : "./images/Heptarun-43.jpg";
    imageElement.src = imageSrc;

    imageElement.onload = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const imageWidth = imageElement.naturalWidth;
      const imageHeight = imageElement.naturalHeight;

      const shouldUseMin = scrollHeight > screenHeight;
      const imageRatio = shouldUseMin
        ? Math.min(screenWidth / imageWidth, scrollHeight / imageHeight)
        : Math.max(screenWidth / imageWidth, scrollHeight / imageHeight);

      setFormStyle(imageSrc, imageRatio);
    };

    document.documentElement.style.setProperty(
      "--doc-height",
      `${screenHeight}px`
    );
  };

  const showError = (message) => {
    let errorMessageTimeout;

    if (!errorMessage) {
      console.error("Error message element not found.");
      return;
    }

    errorMessage.textContent = message;
    errorMessage.classList.remove("active");
    errorMessage.classList.add("active");

    clearTimeout(errorMessageTimeout);

    errorMessageTimeout = setTimeout(() => {
      errorMessage.textContent = "";
      errorMessage.classList.remove("active");
    }, 2000);
  };

  const handleLogin = async () => {
    const account = accountInput.value;
    const password = passwordInput.value;

    if (!account || !password) {
      showError("Account or Password cannot be empty.");
      return;
    }

    const apiUrl = "LOGIN_API_URL";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account, password }),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (data.error) {
        showError(data.error);
        passwordInput.value = "";
      }
    } catch (error) {
      console.error(error);
      showError("An error occurred, please try again later.");
      passwordInput.value = "";
    }
  };

  loginBtn.addEventListener("click", handleLogin);

  formBox.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  handleResize();
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
};

window.addEventListener("load", doFirst);
