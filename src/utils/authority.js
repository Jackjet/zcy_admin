// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const exp =30000;
  const curTime = new Date().getTime();
  const key = localStorage.getItem('antd-pro-authority');
  if(key){
    if(isJSON(key)){
      const dataObj = JSON.parse(key);
      if (curTime - dataObj.time > exp){
        return "guest"
      }
      return dataObj.data;
    }else{
      return "18888888888";
    }
  }
  return "guest";

  //return localStorage.getItem('antd-pro-authority') || '';
}


function isJSON(str) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch(e) {
  }
  return false;
}

export function setAuthority(authority) {

  let curTime = new Date().getTime();
  let authorityvalue = JSON.stringify({data:authority,time:curTime});

  return localStorage.setItem('antd-pro-authority', authorityvalue);
}

export function setuser(user) {
  if(user){
  return  localStorage.setItem('user', JSON.stringify(user));
  }else {
   return localStorage.setItem('user', "");
  }

}

