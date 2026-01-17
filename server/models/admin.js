const db = require('../config/database');

class Admin {
  // 验证管理员密码
  static verifyPassword(password, callback) {
    db.get('SELECT * FROM admin WHERE id = 1', (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      // 简单的密码比较（实际项目中应该使用加密）
      const isValid = row && row.password === password;
      callback(null, isValid);
    });
  }
  
  // 修改管理员密码
  static changePassword(newPassword, callback) {
    db.run('UPDATE admin SET password = ? WHERE id = 1', [newPassword], (err) => {
      if (err) {
        callback(err);
        return;
      }
      
      callback(null, true);
    });
  }
}

module.exports = Admin;