CREATE TABLE users (
id int(11) NOT NULL AUTO_INCREMENT,
userName varchar(255) NOT NULL,
email varchar(255) NOT NULL,
firstName varchar(255) NOT NULL,
lastName varchar(255) NOT NULL,
password varchar(255) NOT NULL,
activation enum('register', 'active', 'fake') NOT NULL DEFAULT 'register',
sex enum('Male', 'Female'),
sexualPreference enum('Hetero', 'Homo', 'Bi'),
fame SMALLINT UNSIGNED NOT NULL DEFAULT 0,
age TINYINT UNSIGNED,
biography TEXT,
profilePicture varchar(255),
location POINT,
online tinyint(1) NOT NULL DEFAULT 0,
socketid varchar(20),
resetPasswordToken varchar(255),
PRIMARY KEY (id),
UNIQUE KEY userName (userName),
UNIQUE KEY email (email),
UNIQUE KEY profilePicture (profilePicture));

CREATE TABLE pictures (
id int(11) NOT NULL AUTO_INCREMENT,
userId int(11) NOT NULL,
path varchar(255) NOT NULL,
PRIMARY KEY (id));

CREATE TABLE interests (
id int(11) NOT NULL AUTO_INCREMENT,
userId int(11) NOT NULL,
interest varchar(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE (userId, interest));

CREATE TABLE visits (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id));

CREATE TABLE likes (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
UNIQUE (fromUserId, toUserId));

CREATE TABLE matchs (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
UNIQUE (fromUserId, toUserId));

CREATE TABLE messages (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
message TEXT,
PRIMARY KEY (id));

CREATE TABLE notifications (
id int(11) NOT NULL AUTO_INCREMENT,
userId int(11) NOT NULL,
type enum('like', 'visit', 'message', 'match', 'unmatch') NOT NULL,
PRIMARY KEY (id));

CREATE TABLE fakes (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
UNIQUE (fromUserId, toUserId));

CREATE TABLE blocks (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
UNIQUE (fromUserId, toUserId));
