SELECT
  uuid() AS `id`,
  `streamconnect-earn`.`Bounties`.`token` AS `token`,
  count(0) AS `count`,
  sum(`streamconnect-earn`.`Bounties`.`rewardAmount`) AS `total`
FROM
  `streamconnect-earn`.`Bounties`
GROUP BY
  `streamconnect-earn`.`Bounties`.`token`