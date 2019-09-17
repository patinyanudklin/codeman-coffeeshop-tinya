'use strict';
module.exports = (sequelize, DataTypes) => {
  const orderItems = sequelize.define('orderItems', {
    order_id: DataTypes.INTEGER,
    item_number: DataTypes.INTEGER,
    beverage_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  orderItems.associate = function(models) {
    // associations can be defined here
  };
  return orderItems;
};