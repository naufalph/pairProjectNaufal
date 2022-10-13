'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      Post.belongsTo(models.Tag);
      Post.hasMany(models.Comment);
    }
    get description(){
      let arrCont = this.content.split(" ");
      let description = "";
      if(arrCont.length<10){
        return this.content;
      } else {
        for(let i = 0; i<10;i++){
          description+=`${arrCont[i]} `;
        }
        description+=" .....";
      }
      return description;
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    imageURL: DataTypes.STRING,
    upvote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    hooks: {
      beforeCreate:(instance)=>{
        instance.createdAt = new Date();
        instance.updatedAt = new Date();
        instance.upvote = 0;
        instance.TagId = +instance.TagId;
        instance.UserId = +instance.UserId;
      }
    }
  });
  return Post;
};