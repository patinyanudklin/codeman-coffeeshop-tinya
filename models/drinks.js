'use strict';
module.exports = (sequelize, DataTypes) => {
  const drinks = sequelize.define('drinks', {
    drink_name: DataTypes.STRING,
    category: DataTypes.STRING,
    price: DataTypes.INTEGER,
    imgUrl: DataTypes.STRING
  }, {});
  drinks.associate = function(models) {
    // associations can be defined here
  };
  return drinks;
};