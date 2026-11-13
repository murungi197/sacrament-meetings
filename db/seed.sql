INSERT INTO meetings (
  date, meeting_type, presiding, conducting, announcements,
  opening_hymn, opening_prayer, ward_business, stake_business,
  sacrament_hymn, speakers, closing_hymn, closing_prayer
) VALUES
(
  '2026-01-04', 'testimony', 'Bishop Thompson', 'Brother Nakamura',
  ARRAY[]::TEXT[],
  '{"number":134,"title":"I Believe in Christ"}'::JSONB, 'Sister Park',
  '[]'::JSONB, FALSE,
  '{"number":175,"title":"God, Our Father, Hear Us Pray"}'::JSONB,
  '[{"name":"Sister Wallace","topic":"The Savior in our lives","type":"speaker"},{"name":"Brother Nathan Smith","topic":"A testimony of Jesus Christ","type":"speaker"}]'::JSONB,
  '{"number":219,"title":"Because I Have Been Given Much"}'::JSONB, 'Brother Alvarez'
),
(
  '2026-01-11', 'regular', 'Bishop Thompson', 'Brother Nakamura',
  ARRAY['Ward temple night: Jan 30'],
  '{"number":2,"title":"The Spirit of God"}'::JSONB, 'Sister Ramirez',
  '[{"description":"Sustaining of new Sunday School president"}]'::JSONB, TRUE,
  '{"number":169,"title":"In Remembrance of Thy Suffering"}'::JSONB,
  '[{"name":"Sister Chen","topic":"The Sacrament","type":"speaker"},{"name":"Brother Osei","topic":"Covenant Keeping","type":"speaker"}]'::JSONB,
  '{"number":31,"title":"O God, Our Help in Ages Past"}'::JSONB, 'Brother Lewis'
),
(
  '2026-01-18', 'regular', 'Bishop Thompson', 'Sister Torres',
  ARRAY['Ministering interviews this week'],
  '{"number":85,"title":"How Firm a Foundation"}'::JSONB, 'Brother Kim',
  '[{"description":"Release - Sister Martinez - Primary Teacher"},{"description":"Sustain - Sister Agbavor - Primary Teacher"},{"description":"Sustain - Sister Mukiwa - RS 2nd Counselor"}]'::JSONB, FALSE,
  '{"number":173,"title":"While of These Emblems We Partake"}'::JSONB,
  '[{"name":"Sister Nakamura","topic":"Personal Revelation","type":"speaker"},{"name":"Youth Choir","topic":"","type":"musical-number"},{"name":"Brother Santos","topic":"Temple Covenants","type":"speaker"}]'::JSONB,
  '{"number":226,"title":"Improve the Shining Moments"}'::JSONB, 'Sister Jensen'
),
(
  '2026-01-25', 'stake', 'President Gimenez', 'Brother Ellis',
  ARRAY[]::TEXT[],
  '{"number":27,"title":"Praise to the Man"}'::JSONB, 'Sister Delgado',
  '[]'::JSONB, TRUE,
  '{"number":194,"title":"There Is a Green Hill Far Away"}'::JSONB,
  '[{"name":"President Gimenez","topic":"Building faith in Jesus Christ","type":"speaker"},{"name":"Sister Okafor","topic":"Serving with love","type":"speaker"}]'::JSONB,
  '{"number":134,"title":"I Believe in Christ"}'::JSONB, 'Brother Whitaker'
),
(
  '2026-02-01', 'regular', 'Bishop Thompson', 'Sister Torres',
  ARRAY['Youth activity on Friday evening'],
  '{"number":6,"title":"Redeemer of Israel"}'::JSONB, 'Brother Patel',
  '[{"description":"Sustain - Brother Flores - Elders Quorum Secretary"}]'::JSONB, FALSE,
  '{"number":184,"title":"Upon the Cross of Calvary"}'::JSONB,
  '[{"name":"Sister Brooks","topic":"Finding hope in Christ","type":"speaker"},{"name":"Brother Adeyemi","topic":"A lifetime of discipleship","type":"speaker"}]'::JSONB,
  '{"number":301,"title":"I Am a Child of God"}'::JSONB, 'Sister Park'
),
(
  '2026-02-08', 'testimony', 'Bishop Thompson', 'Brother Nakamura',
  ARRAY['Fast and testimony meeting'],
  '{"number":26,"title":"Joseph Smith''s First Prayer"}'::JSONB, 'Sister Alvarez',
  '[]'::JSONB, FALSE,
  '{"number":175,"title":"God, Our Father, Hear Us Pray"}'::JSONB,
  '[{"name":"Brother Nguyen","topic":"Gratitude for the Savior","type":"speaker"},{"name":"Sister Mensah","topic":"Answers to prayer","type":"speaker"}]'::JSONB,
  '{"number":19,"title":"We Thank Thee, O God, for a Prophet"}'::JSONB, 'Brother Kim'
),
(
  '2026-02-15', 'general', 'Bishop Thompson', 'Sister Reed',
  ARRAY['Ward family history center is open after meetings'],
  '{"number":2,"title":"The Spirit of God"}'::JSONB, 'Brother Lewis',
  '[{"description":"Ward conference preparation"}]'::JSONB, FALSE,
  '{"number":181,"title":"Jesus of Nazareth, Savior and King"}'::JSONB,
  '[{"name":"Sister Patel","topic":"Covenants and daily choices","type":"speaker"},{"name":"Brother Wallace","topic":"Ministering as the Savior did","type":"speaker"}]'::JSONB,
  '{"number":220,"title":"Lord, I Would Follow Thee"}'::JSONB, 'Sister Delgado'
),
(
  '2026-02-22', 'stake', 'President Gimenez', 'Sister Ellis',
  ARRAY['Stake youth conference registration is open'],
  '{"number":134,"title":"I Believe in Christ"}'::JSONB, 'Brother Osei',
  '[]'::JSONB, TRUE,
  '{"number":169,"title":"In Remembrance of Thy Suffering"}'::JSONB,
  '[{"name":"Elder Rivera","topic":"Strengthening families through faith","type":"speaker"},{"name":"Sister Chen","topic":"Courage to follow the Savior","type":"speaker"}]'::JSONB,
  '{"number":85,"title":"How Firm a Foundation"}'::JSONB, 'Sister Mensah'
),
(
  '2026-11-08', 'regular', 'Bishop Thompson', 'Sister Reed',
  ARRAY['Ward service project sign-up is open'],
  '{"number":2,"title":"The Spirit of God"}'::JSONB, 'Brother Alvarez',
  '[{"description":"Ward conference follow-up"}]'::JSONB, FALSE,
  '{"number":169,"title":"In Remembrance of Thy Suffering"}'::JSONB,
  '[{"name":"Sister Brooks","topic":"Faith in Jesus Christ","type":"speaker"},{"name":"Brother Patel","topic":"Serving in the covenant path","type":"speaker"}]'::JSONB,
  '{"number":301,"title":"I Am a Child of God"}'::JSONB, 'Sister Nakamura'
)
ON CONFLICT (date) DO UPDATE SET
  meeting_type = EXCLUDED.meeting_type,
  presiding = EXCLUDED.presiding,
  conducting = EXCLUDED.conducting,
  announcements = EXCLUDED.announcements,
  opening_hymn = EXCLUDED.opening_hymn,
  opening_prayer = EXCLUDED.opening_prayer,
  ward_business = EXCLUDED.ward_business,
  stake_business = EXCLUDED.stake_business,
  sacrament_hymn = EXCLUDED.sacrament_hymn,
  speakers = EXCLUDED.speakers,
  closing_hymn = EXCLUDED.closing_hymn,
  closing_prayer = EXCLUDED.closing_prayer;
