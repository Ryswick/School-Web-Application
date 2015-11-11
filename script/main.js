var rootRef = new Firebase('https://tpj2ee.firebaseio.com/');

/*var villageRef = rootRef.child("village");
villageRef.push({
  tallende: {
    name: "tallende",
  }
});*/

var app = {

};

    app.controller = function() {
      this.email = m.prop(""),
      this.password = m.prop(""),
      this.authentifier = function() {
            console.log(this.email + " " + this.password;
        }
    };

    app.view = function(ctrl) {
        return m('form[class="formAuth"]', [
            m('input[name=email]', { onchange : m.withAttr("value", ctrl.email), value : ctrl.email()}),
            m('input[name=password]', { onchange: m.withAttr("value", ctrl.password), value : ctrl.password()}),
            m('button[type=button]', { onclick: ctrl.authentifier}, 'Create Account')
        ]);
    };


/*var connecter = function(){
  rootRef.authWithPassword({
    "email" :
  })
}*/

m.module(document.getElementById("container"), app);
