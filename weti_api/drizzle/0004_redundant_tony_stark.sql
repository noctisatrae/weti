ALTER TABLE "jobs" RENAME COLUMN "timestamp" TO "expiration";

-- THIS DELETE OLD ROWS WHEN THE EXPIRATION DATE IS SMALLER THAN THE CURRENT DATE --
CREATE FUNCTION delete_old_rows() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deletes rows from the jobs table where the timestamp is older than the current timestamp
  DELETE FROM jobs WHERE "expiration" < CURRENT_TIMESTAMP;
  RETURN NULL;
END;
$$;

CREATE TRIGGER delete_expired_jobs
AFTER INSERT OR UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION delete_old_rows();