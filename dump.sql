--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: samihbassam
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO samihbassam;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: samihbassam
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: samihbassam
--

CREATE TYPE public.transaction_status AS ENUM (
    'pending',
    'paid'
);


ALTER TYPE public.transaction_status OWNER TO samihbassam;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: items; Type: TABLE; Schema: public; Owner: samihbassam
--

CREATE TABLE public.items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    price integer NOT NULL,
    store_id uuid NOT NULL,
    image_url character varying(255),
    stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.items OWNER TO samihbassam;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: samihbassam
--

CREATE TABLE public.stores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stores OWNER TO samihbassam;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: samihbassam
--

CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    item_id uuid NOT NULL,
    quantity integer NOT NULL,
    total integer NOT NULL,
    status public.transaction_status DEFAULT 'pending'::public.transaction_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO samihbassam;

--
-- Name: users; Type: TABLE; Schema: public; Owner: samihbassam
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO samihbassam;

--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: samihbassam
--

COPY public.items (id, name, price, store_id, image_url, stock, created_at) FROM stdin;
4abd4de6-ac33-41a2-83c8-6b9b82beb9c5	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 18:23:58.372555
c14f8c51-d410-4265-8ce5-708aaa736cab	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 18:31:01.993326
011cb68a-4b6b-423f-a9c2-7047a11a4b17	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 18:35:23.62527
377d90fe-b7b2-4c09-a9b6-4b93e4905d0a	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 18:36:26.98174
d7f7090a-af75-4763-a489-5595df381154	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 18:47:03.089307
8b0c4698-ced8-473d-af20-6da5e100b355	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 19:14:02.42949
bdb334bd-9104-4c3d-a82c-eddce9c4471e	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 20:52:51.825152
b1970902-d1f8-4860-b551-6956b3e6d808	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	\N	10	2025-03-15 20:56:05.804694
a4e763d1-d7a6-41a6-a18b-152d2f130ce6	Laptop Gaming MSI	15000000	a104f5a8-780e-4e9e-a588-2aa0a0cf347d	\N	15	2025-03-15 21:15:19.563144
658f81b4-3a61-4067-b30a-4f84e1331fb5	Laptop Gaming MSI	15000000	8bec5e2c-fcf1-4842-93d2-89c05f0f587e	https://res.cloudinary.com/duegqdft3/image/upload/v1742073749/items/wtgtqoruxnknn28kkqww.png	15	2025-03-15 21:22:29.949642
76a82bcd-8d8d-4968-8a83-8bf495dc472d	Laptop Gaming MSI	15000000	41a37db1-79db-4641-9fac-361fad29d75e	https://res.cloudinary.com/duegqdft3/image/upload/v1742074085/items/al7q59gfrrktltqye1yt.png	15	2025-03-15 20:56:22.937582
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: samihbassam
--

COPY public.stores (id, name, address, created_at) FROM stdin;
41a37db1-79db-4641-9fac-361fad29d75e	UI Store Engineering	Kota tercinta Depok, FTUI	2025-03-11 19:26:17.452817
a104f5a8-780e-4e9e-a588-2aa0a0cf347d	UI Store Engineering	Kota tercinta Depok, FTUI	2025-03-11 19:28:35.870495
8bec5e2c-fcf1-4842-93d2-89c05f0f587e	UI Store Engineering	Kota tercinta Depok, FTUI	2025-03-11 19:31:12.444621
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: samihbassam
--

COPY public.transactions (id, user_id, item_id, quantity, total, status, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: samihbassam
--

COPY public.users (id, name, email, password, balance, created_at) FROM stdin;
f0866dd7-8890-449f-abd7-6bdd27c0aa2f	Samih	samih@ntar.com	$2b$10$aX14.VK.768Y3iYYBNaGAur9no/LCh0aXlGqyo255Vl6TiykL9IYm	9999	2025-03-12 06:02:17.691566
12342d28-b75b-4a65-96b0-4d5221af5594	Bassam	Bassam@email.com	$2b$10$vzHDOe/53w.v/9ZhA7YgWe5O2BFcAu9jPLr1JNZYKnhy6axFRb0Jq	0	2025-03-19 05:46:47.854963
eb327a38-ef25-4986-b99d-c0f4ce104a84	Bassam	Bassm@email.com	$2b$10$RHdQi1Oy/HI95GOlJyR6Vuz8fvl2bw6lXpnOdILbRLxiJtgJZ2.y2	0	2025-03-19 07:01:17.079161
22c8cd63-b02b-4f15-939d-0396fb58ab2a	Bassam	Bassam@gmail.com	$2b$10$l.Aaz3za.66/TZY.Fw67/.aOIpawUHPozcZ09f5s7XDWXq121SzFC	1987000000	2025-03-19 07:11:37.379222
\.


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: items items_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: samihbassam
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: samihbassam
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

