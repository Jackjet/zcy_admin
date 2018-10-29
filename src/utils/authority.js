// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const exp =300000;
  let curTime = new Date().getTime();
  var key = localStorage.getItem('antd-pro-authority');
  if(key){
    if(isJSON(key)){
      var dataObj = JSON.parse(key);
      if (curTime - dataObj.time > exp){
        return "18888888888"
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
