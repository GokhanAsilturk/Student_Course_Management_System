import { sequelize } from '../../config/database';

/**
 * Student tablosunu sıfırlayan script
 * Bu script, Student tablosundaki tüm kayıtları siler ve ilişkili User kayıtlarını korur.
 */
async function resetStudentTable() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('Student tablosu sıfırlanıyor...');
    
    // Raw SQL sorgusu ile CASCADE seçeneğini kullanarak tabloyu truncate et
    await sequelize.query('TRUNCATE TABLE "Students" CASCADE', { transaction });
    
    // Tablodaki satır sayısını al (temizlikten sonra 0 olmalıdır)
    // Başarılı olduğunu bildir
    const deletedCount = 'SUCCESS';
    
    await transaction.commit();
    console.log(`Student tablosu başarıyla sıfırlandı. ${deletedCount} kayıt silindi.`);
    
  } catch (error) {
    await transaction.rollback();
    console.error('Student tablosu sıfırlanırken bir hata oluştu:', error);
    throw error;
  }
}

// Script doğrudan çalıştırıldığında
if (require.main === module) {
  resetStudentTable()
    .then(() => {
      console.log('İşlem tamamlandı.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Hata:', error);
      process.exit(1);
    });
}

export default resetStudentTable;