INSERT INTO public.account (
account_firstname,
account_lastname,
account_email,
account_password
) VALUES 
('Tony', 'tony@starkent.com','Stark','Iam1ronM@n');


UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM public.account
WHERE account_id = 1;

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer'


SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
    ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_id = 2;

UPDATE public.inventory
SET inv_image, inv_thumbnail = REPLACE(inv_image, inv_thumbnail, '/images/', '/images/vehicles/');
