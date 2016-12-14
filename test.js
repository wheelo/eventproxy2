var fs = require('fs');
var EventProxy = require('./eventproxy2.js');
var proxy = new EventProxy();
var add= function (v1, v2, v3){
   console.log(v1+v2+v3);
   console.log((v1-0)+(v2-0)+(v3-0));
};
// 侦听error事件 
proxy.bind('error', function (err) {
  // 卸载掉所有handler 
  proxy.unbind();
  //输出错误
  console.log(err);
});

proxy.assign("v1", "v2", "v3", add);

fs.readFile('./a.txt',{encoding:'utf8',flag:'r'},function (err, data) {
  if (err) {
    return proxy.emit('error', err);
  }else{
    proxy.trigger("v1", data);
  }
});

fs.readFile('./b.txt',{encoding:'utf8',flag:'r'},function (err, data) {
  if (err) {
    return proxy.emit('error', err);
  }else{
    proxy.trigger("v2", data);
  }
});

fs.readFile('./c.txt',{encoding:'utf8',flag:'r'},function (err, data) {
  if (err) {
    return proxy.emit('error', err);
  }else{
    proxy.trigger("v3", data);
  }
});