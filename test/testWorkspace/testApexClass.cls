@isTest
public class AccountTestFactoryMVN {
    public static Integer AccountBuildIndex = 0;

    public static Account insertPhysician(){
        Account physician = buildPhysician();

        insert physician;

        return physician;
    }

    public static Account buildPhysician(){
        Account physician = new Account(
            FirstName = 'Physician',
            LastName = 'Account #' + AccountBuildIndex,
        );
        AccountBuildIndex++;

        return physician;
    }

    public static List<Account> insertPhysicians(Integer count){
        List<Account> physicians = buildPhysicians(count);

        insert physicians;

        return physicians;
    }

    public static List<Account> buildPhysicians(Integer count){
        List<Account> physicians = new List<Account>();

        for(Integer index = 0; index < count; index++){
            physicians.add(buildPhysician());
        }

        return physicians;
    }
}