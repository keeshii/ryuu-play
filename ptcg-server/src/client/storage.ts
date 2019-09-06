
const help = `
This is storage object. It allows to perform basic tasks on the database.

db - object for db manipulation. For more info type help(storage.db).
resetAllData() - removes all data from the database.
`;

export class Storage {

  public static readonly shortHelp: string = 'Storage help describtion';
  
  public static readonly help: string = help;

}
