-- Rename legacy branding to thinkbuildlabs.

update public.site_settings
set
  "siteName" = 'thinkbuildlabs',
  "updatedAt" = now()
where lower(trim(coalesce("siteName", ''))) in (
  'vlsi & ai robotics lab',
  'vlsi & ai lab',
  'everywhere'
);

update public.about_data
set description = replace(
  replace(description, 'VLSI & AI Robotics Lab', 'thinkbuildlabs'),
  'VLSI & AI Lab',
  'thinkbuildlabs'
)
where
  description like '%VLSI & AI Robotics Lab%'
  or description like '%VLSI & AI Lab%';

update public.about_data
set history = (
  select coalesce(
    jsonb_agg(
      case
        when jsonb_typeof(item) = 'object' then
          jsonb_set(
            item,
            '{description}',
            to_jsonb(
              replace(
                replace(coalesce(item->>'description', ''), 'VLSI & AI Robotics Lab', 'thinkbuildlabs'),
                'VLSI & AI Lab',
                'thinkbuildlabs'
              )
            )
          )
        else item
      end
    ),
    '[]'::jsonb
  )
  from jsonb_array_elements(coalesce(history, '[]'::jsonb)) as item
)
where history is not null;
