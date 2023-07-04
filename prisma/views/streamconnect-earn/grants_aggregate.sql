SELECT
  uuid() AS `id`,
  `streamconnect-earn`.`Grants`.`token` AS `token`,
  count(0) AS `count`,
  sum(`streamconnect-earn`.`Grants`.`rewardAmount`) AS `total`
FROM
  `streamconnect-earn`.`Grants`
GROUP BY
  `streamconnect-earn`.`Grants`.`token`