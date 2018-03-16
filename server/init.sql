CREATE TABLE users (
id int(11) NOT NULL AUTO_INCREMENT,
userName varchar(255) NOT NULL,
email varchar(255) NOT NULL,
firstName varchar(255) NOT NULL,
lastName varchar(255) NOT NULL,
password varchar(255) NOT NULL,
activation ENUM('register', 'active', 'fake') NOT NULL DEFAULT 'register',
sex ENUM('m', 'f'),
sexualPreference SET('m', 'f') DEFAULT 'm,f',
fame SMALLINT UNSIGNED NOT NULL DEFAULT 1,
age TINYINT UNSIGNED,
biography TEXT,
picture0 varchar(255),
picture1 varchar(255),
picture2 varchar(255),
picture3 varchar(255),
picture4 varchar(255),
locationName varchar(255),
location POINT,
lastConnexion TIMESTAMP,
online tinyint(1) NOT NULL DEFAULT 0,
socketid varchar(20),
resetPasswordToken varchar(255),
PRIMARY KEY (id),
UNIQUE KEY userName (userName),
UNIQUE KEY email (email)
);

CREATE TABLE interests (
id int(11) NOT NULL AUTO_INCREMENT,
userId int(11) NOT NULL,
interest varchar(255) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (userId) REFERENCES users(id),
UNIQUE (userId, interest)
);

CREATE TABLE visits (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (fromUserId) REFERENCES users(id),
FOREIGN KEY (toUserId) REFERENCES users(id)
);

CREATE TABLE likes (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (fromUserId) REFERENCES users(id),
FOREIGN KEY (toUserId) REFERENCES users(id),
UNIQUE (fromUserId, toUserId)
);

CREATE TABLE matchs (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (fromUserId) REFERENCES users(id),
FOREIGN KEY (toUserId) REFERENCES users(id),
UNIQUE (fromUserId, toUserId)
);

CREATE TABLE messages (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
message TEXT,
PRIMARY KEY (id),
FOREIGN KEY (fromUserId) REFERENCES users(id),
FOREIGN KEY (toUserId) REFERENCES users(id)
);

CREATE TABLE notifications (
id int(11) NOT NULL AUTO_INCREMENT,
toUserId int(11) NOT NULL,
fromUserId int(11) NOT NULL,
type enum('like', 'visit', 'message', 'match', 'unmatch') NOT NULL,
seen TINYINT(1) NOT NULL DEFAULT 0,
PRIMARY KEY (id),
FOREIGN KEY (toUserId) REFERENCES users(id),
FOREIGN KEY (fromUserId) REFERENCES users(id)
);

CREATE TABLE fakes (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
UNIQUE (fromUserId, toUserId)
);

CREATE TABLE blocks (
id int(11) NOT NULL AUTO_INCREMENT,
fromUserId int(11) NOT NULL,
toUserId int(11) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (fromUserId) REFERENCES users(id),
FOREIGN KEY (toUserId) REFERENCES users(id),
UNIQUE (fromUserId, toUserId)
);
