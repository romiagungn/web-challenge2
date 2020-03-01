CREATE TABLE crud(
    id integer primary key AUTO INCREMENT,
    string text,
    integer integer,
    float float,
    date date,
    boolean boolean
);

INSERT INTO crud (string, integer, float,date,boolean) VALUES ("romi", 20 , "2.19", "2020-02-02" , "true")