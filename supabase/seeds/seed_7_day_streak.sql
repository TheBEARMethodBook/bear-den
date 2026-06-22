-- Seeds a 7-day streak for a test account so you can preview the
-- "Seven days of intentional connection" celebration message without
-- waiting a week. Run in the Supabase SQL editor.
--
-- Replace the email below with the account you're testing with.

-- 1. Clear out the last 7 days for that user first, so re-running this is safe.
delete from public.daily_actions
where user_id = (select id from auth.users where email = 'YOUR_TEST_EMAIL@example.com')
  and completed_at::date between (current_date - interval '6 days') and current_date;

-- 2. Insert 7 consecutive days of completions, streak_count 1 through 7 (today = 7).
with target_user as (
  select id from auth.users where email = 'YOUR_TEST_EMAIL@example.com'
),
days as (
  select generate_series(current_date - interval '6 days', current_date, interval '1 day')::date as day
)
insert into public.daily_actions (user_id, completed_at, action_text, streak_count)
select
  target_user.id,
  day + time '09:00',
  'Call someone you thought of recently. No agenda. Just say hello.',
  row_number() over (order by day)
from days, target_user;

-- 3. Cleanup when you're done testing (run separately, after the celebration check):
-- delete from public.daily_actions
-- where user_id = (select id from auth.users where email = 'YOUR_TEST_EMAIL@example.com')
--   and completed_at::date between (current_date - interval '6 days') and current_date;
