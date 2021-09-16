export function getRemainingDate(date) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(); // getting current date
  const secondDate = new Date(date);
  const diffDays = Math.ceil(Math.abs((firstDate - secondDate) / oneDay));
  return diffDays;
}

export function isReleased(date) {
  const firstDate = new Date(); // getting current date
  const secondDate = new Date(date);
  return firstDate>secondDate
}

export function getColorRate(rate) {
  switch (true) {
    case rate < 5:
      return "red";
    case rate >= 5 && rate <= 6.5:
      return "orange";
    case rate > 6.5:
      return "green";
  }
}

export function getGenderString(gender) {
  switch (gender) {
    case 1:
      return "Female";
    case 2:
      return "Male";
    default:
      return "Unknown!"
  }
}

export function refresh(time){
  setTimeout(
    function () {
      window.location.reload();
    }.bind(this),
    time
  );
}

export function timeout(fun,time){
  setTimeout(fun,
    time
  )
  }

  export function convertTime(time){
    const month = time/60/24/30
    const hours = time/60%24
    // const hours = time/60%24%30
    return {
      "min":(time%60),
      "h":Math.floor(hours),
      "d":Math.floor(time/60/24%30),
      "month":Math.floor(month),
    }
  }

  export function localStorageStore(key, val){
    localStorage.setItem(key, JSON.stringify(val));
  }
  export function localStorageRetrieve(key){
    var retrievedObject = localStorage.getItem(key);
    return JSON.parse(retrievedObject);
  }

  export function isGuest(){
    return localStorageRetrieve("uid") === "guest"
  }

  export function logout() {
    localStorage.removeItem("isAuth")
    localStorage.removeItem("email")
    localStorage.removeItem("uid")
    localStorage.removeItem("photoURL")
    localStorage.removeItem("displayName")
    localStorage.removeItem("session_id")
    refresh(0)
  }

