Feature: buying tickets

        Scenario: the user selects and books one seat
                Given user is on page
                When user choose 4-th day and movie
                And select 7 row and 6 seat
                Then ticket purchase is confirmed

        Scenario: the user selects and books several seats
                Given user is on page
                When user choose 7-th day and movie
                And select 7 row and 7,8 seats
                Then ticket purchase is confirmed

        Scenario: the user trying to select reserved seats
                Given user is on page
                When user choose 3-th day and movie
                And select 4 row and 6 seat
                And user is on page
                When user choose 3-th day and movie
                Then booking is not possiblen