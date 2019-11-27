import service from './service.js';

async function getSystemStatus(req, res) {
  res.send({
    db: Number(await service.isDBAccessible()),
  });
}

export default {
  getSystemStatus,
};
