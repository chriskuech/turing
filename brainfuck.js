(function (window) {



"use strict";


var _ = null;

var env = {};

uxadt.tdef(env, "Stmt", {
  Acc: [],
  Rej: [],
  Halt: [],
  L: ["Stmt"],
  R: ["Stmt"],
  Inc: ["Stmt"],
  Dec: ["Stmt"],
  Get: ["Stmt"],
  Put: ["Stmt"],
  While: ["Stmt", "Stmt"],
  End: []
});



function tokenize(s) {
  return s.replace(/#[^\n]*/g, '')
          .split('')
          .filter(function (t) {
             return !/\s/.test(t);
           });
}




function parse(ts) {
  var res, stmt, stmt1, stmt2;

  if (!ts.length) {
    return [env.End(), []];
  }

  if ('ARH]'.indexOf(ts[0]) > -1) {
    switch (ts[0]) {
      case 'A': return [env.Acc(),  ts.slice(1)];
      case 'R': return [env.Rej(),  ts.slice(1)];
      case 'H': return [env.Halt(), ts.slice(1)];
      case ']': return [env.End(),  ts.slice(1)];
    }
  }

  if ('><+-.,'.indexOf(ts[0]) > -1) {
    res = parse(ts.slice(1));
    stmt = res[0];
    var ts0 = res[1];
    switch (ts[0]) {
      case '>': return [env.R(stmt),   ts0];
      case '<': return [env.L(stmt),   ts0];
      case '+': return [env.Inc(stmt), ts0];
      case '-': return [env.Dec(stmt), ts0];
      case '.': return [env.Put(stmt), ts0];
      case ',': return [env.Get(stmt), ts0];
    }
  }

  if (ts[0] === '[') {
    res = parse(ts.slice(1));
    stmt1 = res[0];
    ts = res[1];
    res = parse(ts);
    stmt2 = res[0];
    ts = res[1];
    return [env.While(stmt1, stmt2), ts];
  }

}





function exec(stmt, callback) {
  if (machine.halted) {
    $('html, body').css('cursor', 'auto');
    return;
  }
  return stmt
    ._(env.Acc(), machine.accept)
    ._(env.Rej(), machine.reject)
    ._(env.Halt(), machine.halt)
    ._(env.L(_), function (stmt) {
        machine.move('left', function () {
          exec(stmt, callback);
        });
      })
    ._(env.R(_), function (stmt) {
        machine.move('right', function () {
          exec(stmt, callback);
        });
      })
    ._(env.Inc(_), function (stmt) {
        machine.write(machine.read() + 1);
        exec(stmt, callback);
      })
    ._(env.Dec(_), function (stmt) {
        machine.write(machine.read() - 1);
        exec(stmt, callback);
      })
    ._(env.Get(_), function (stmt) {
        terminal.get(function (c) {
          machine.write(c.charCodeAt(0));
          exec(stmt, callback);
        });
      })
    ._(env.Put(_), function (stmt) {
        terminal.put(String.fromCharCode(machine.read()));
        exec(stmt, callback);
      })
    ._(env.While(_,_), function (stmt1, stmt2) {
        if (machine.read()) {
          exec(stmt1, function () {
            exec(env.While(stmt1, stmt2), callback);
          });
        } else {
          exec(stmt2, callback);
        }
      })
    ._(env.End(), function () {
        if (callback) {
          callback();
        }
      })
    .end;
}






window.interpret = function (s) {
  var ts = tokenize(s);
  var res = parse(ts);
  if (res[1].length) {
    terminal.error("The program you entered is invalid\n\tmake sure the \
                    all the brackets are balanced and there are no commands \
                    to be executed after any halting commands.");
    return;
  }
  var stmt = res[0];
  machine.halted = false;
  terminal.start();
  $('html, body').css('cursor', 'wait');
  setTimeout(function () {
    exec(stmt, machine.halt);
  }, 100);
}






})(window);
