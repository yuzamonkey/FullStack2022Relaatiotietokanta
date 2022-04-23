CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) values ('ScoobyDoo', 'www.scoobydoo.com', 'ScoobyDoo adventures');
INSERT INTO blogs (author, url, title) values ('Donald Duck', 'www.disney.com', 'Donalds daddy issues');